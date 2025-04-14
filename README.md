# conversation-agent

## screencap

![](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmx2d2dleG90emlnODFzMHNzajQzODRyb2Nmb3lkdGZlNWQ2aHN4bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/AMeISoXxTSWQU1YR0K/giphy.gif)

## usage

clone repo onto local machine (requires sqlite installed, comes by default with macOS) and navigate to root directory.

create a .env file with ```OPENAI_API_KEY=<your key here>```

to run dev environment on http://localhost:3000

```
npm install
npm run create-db
npm run dev
```

## about

Demo implementatio of a conversational agent that follows a configurable script for a conversation, using Next.js/typescript. For chatbot use cases that require more structure than a default LLM, such as a videogame NPC, call center agent, or ai job interviewer.

The agent works by following a script using the conversation class declared in ```src/utils/conversationController.ts```. Two sample scripts are provided, one for a videogame NPC in ```src/utils/scripts/gameNPC.ts``` job interview in ```src/utils/scripts/interview.ts```. To switch out the sample scripts or add your own, update the imports in ```src/app/api/chat/route.ts``` and ```src/utils/openai.ts```

The script works by defining a conversation tree, where each node defines the bot's response at that node along with an array of options corresponding to possible user responses, each with a pointer to the next node if that option is selected. The user's responses are classified as one of the available options using openai's structured outputs api (see ```src/utils/openai.ts```).

The agent has the ability to answer users' questions when the user input is classified as a question, by querying the openai api using a system prompt configured in the script. 

The conversation state is saved in a sqlite database along with the previous messages so the conversations can be loaded and resumed. This demo implementation has a "completed" state after which further user responses are disabled, allowing conversations to end early. The conversation class in ```src/utils/conversationController.ts``` can be updated to add functionality according to your use case.


