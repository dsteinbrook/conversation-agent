import {OpenAI} from 'openai';
import {zodResponseFormat} from "openai/helpers/zod";
import {z} from "zod";
import {systemPrompt} from './scripts/gameNPC';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

//schema for structured output of classifyUserMessage function
const ClassificationSchema = z.object({
    selectedOptionIndex: z.number()
  });

interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }

//classify user message as one of the options using openai structured outputs
export async function classifyUserMessage(messages: ChatMessage[], options: string[]) {
    if (options.length <= 1){
        return 0
    }
    try {
 
     if (!messages[messages.length-1].content.trim()) {
         throw new Error('User message cannot be empty');
       }
       
    // Format options for the prompt
     const formattedOptions = options
     .map((option, index) => `${index}: ${option}`)
     .join('\n');
   
   // Create the system prompt
   const systemPrompt = `
        You are a classification assistant. Your task is to classify the last user message into exactly one of the provided options.
        Choose the option that best matches the user's message, given the context of the previous conversation.
        
        Available options:
        ${formattedOptions}
        
        Respond with the index of the selected option (0 to ${options.length - 1}).
        You must select exactly one option.
 `;
 
   // Make the API call with structured output
   const response = await openai.beta.chat.completions.parse({
     model: "gpt-4o",
     messages: [
 
         {
             role: 'system',
             content: systemPrompt
         }, ...messages
 
     ],
     response_format: zodResponseFormat(ClassificationSchema, 'option')
   });
 
   const optionIndex = response.choices[0].message.parsed?.selectedOptionIndex || 0;
   return optionIndex;
 
    } catch(err){
     console.error('Error classifying message:', err);
     
    }
 }

 //answer user question based on job description
 export async function answerUserQuestion(previousMessages: ChatMessage[]){
    try {

        const messages = [{role: 'system', content: systemPrompt}, ...previousMessages] as ChatMessage[];

        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: messages.map((msg: ChatMessage) => ({
              role: msg.role,
              content: msg.content,
            })),
            temperature: 0.1,
          });
        
          const assistantMessage = response.choices[0].message;

          if (!assistantMessage.content) {
            throw new Error('No content in assistant response');
          }

          return assistantMessage;

    } catch (err) {
        console.log(err);
    }
   
 }