import { ConversationStatus, ConversationState } from "@/utils/conversationController";
import conversation from '@/utils/scripts/gameNPC';
import {NextResponse} from 'next/server';
import {classifyUserMessage, answerUserQuestion} from '@/utils/openai'
import {getConversationState, saveConversationStateAndMessages} from "@/utils/db";

interface BotResponse {
role: 'user' | 'assistant' | 'system';
content: string;
status: ConversationStatus;
skipUserInput: boolean;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function retryOperation<T>(operation: () => Promise<T>, operationName: string): Promise<T> {
  let lastError;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed for ${operationName}:`, error);
      
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
      }
    }
  }
  
  throw new Error(`Failed ${operationName} after ${MAX_RETRIES} attempts. Last error: ${lastError}`);
}

export async function POST(req: Request) {
    try {
        const {messages, conversationId, newQuestion} = await req.json();

        // Get conversation state with retries
        let conversationState;
        try {
            conversationState = await retryOperation(
                () => getConversationState(conversationId),
                'getConversationState'
            );
        } catch (error) {
            console.error('Failed to get conversation state:', error);
            // If we can't get the state, start fresh
            conversationState = null;
        }

        if (conversationState) {
            conversation.loadState(conversationState);
        } else {
            const initialState: ConversationState = {
                currentNodeId: '0-0',
                status: ConversationStatus.InProgress,
                flags: {}
            }
            conversation.loadState(
                JSON.stringify(initialState)
            )
        }

        //skip openai queries if not necessary
        if (messages.length === 0 || conversation.getStatus() === ConversationStatus.Completed) {
            const response: BotResponse = {
                role: 'assistant',
                content: conversation.getDialogueText(),
                status: conversation.getStatus(),
                skipUserInput: false
            };

            const savedState = conversation.saveState();
            
            // Save state and message in a transaction with retries
            try {
                await retryOperation(
                    () => saveConversationStateAndMessages({
                        conversationId,
                        state: savedState,
                        messages: [{
                            role: response.role,
                            content: response.content
                        }]
                    }),
                    'saveConversationStateAndMessages'
                );
            } catch (error) {
                console.error('Failed to save conversation state and message:', error);
                // Still return response to user even if save failed
            }

            return NextResponse.json(response);
        }

        //handle case where bot needs to send a second message in a row after answering a question
        if (newQuestion) {
            conversation.setFlag('question', false);
            const savedState = conversation.saveState();
            const response: BotResponse = {
                role: 'assistant',
                content: conversation.getDialogueText(),
                status: conversation.getStatus(),
                skipUserInput: false
            };

            // Save state and message in a transaction with retries
            try {
                await retryOperation(
                    () => saveConversationStateAndMessages({
                        conversationId,
                        state: savedState,
                        messages: [{
                            role: response.role,
                            content: response.content
                        }]
                    }),
                    'saveConversationStateAndMessages'
                );
            } catch (error) {
                console.error('Failed to save conversation state and message:', error);
                // Still return response to user even if save failed
            }

            return NextResponse.json(response);
        }

        const lastUserMessage = messages[messages.length-1];
        const availableOptions = conversation.getAvailableOptions();
  
        const optionIndex = await classifyUserMessage(messages, availableOptions);
        
        //save user's inputted name
        if (conversation.getFlag('collectName')) {
            conversation.processUserResponse(optionIndex || 0, lastUserMessage.content)
        } else {
            conversation.processUserResponse(optionIndex || 0);
        }

        let botMessageText;

        //query openai to answer user's question
        if (conversation.getFlag('question')) {
            botMessageText = (await answerUserQuestion(messages))?.content;
        } else {
            botMessageText = conversation.getDialogueText();
        }
        
        const response: BotResponse = {
            role: 'assistant',
            content: botMessageText as string,
            status: conversation.getStatus(),
            skipUserInput: conversation.getFlag('question')
        }

        const savedState = conversation.saveState();

        // Save state and messages in a transaction with retries
        try {
            await retryOperation(
                () => saveConversationStateAndMessages({
                    conversationId,
                    state: savedState,
                    messages: [
                        {
                            role: lastUserMessage.role,
                            content: lastUserMessage.content
                        },
                        {
                            role: 'assistant',
                            content: response.content
                        }
                    ]
                }),
                'saveConversationStateAndMessages'
            );
        } catch (error) {
            console.error('Failed to save conversation state and messages:', error);
            // Still return response to user even if save failed
        }
    
        return NextResponse.json(response);

    } catch(err) {
        console.error('Error in chat route:', err);
        return NextResponse.json(
            {error: 'Failed to process your request'}, {status: 500}
        )
    }
};