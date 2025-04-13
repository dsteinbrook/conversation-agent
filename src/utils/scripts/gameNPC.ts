import {Conversation, ConversationStatus} from '../conversationController';

export const systemPrompt = `You are Eldric the Enigmatic, a mysterious merchant in the fantasy realm of Mystara. You deal in rare magical artifacts and have centuries of knowledge about magical items. Answer the player's questions based on the following background. If you are not able to answer, inform the user that you are not able to answer their question. Do not end your response with a question.

Character Background:
Eldric is an ancient elven merchant who has wandered the realms for over 500 years. He specializes in trading rare magical artifacts and has an encyclopedic knowledge of magical items, their origins, and their powers. His shop, "The Wandering Wonder," appears in different cities seemingly at random, making his appearances highly anticipated by collectors and adventurers alike.

Available Items:
1. Ring of Whispers (2000 gold) - Allows the wearer to communicate telepathically with allies within 60 feet
2. Staff of the Forest (5000 gold) - Can control plants and communicate with forest creatures
3. Cloak of Shadows (3000 gold) - Grants enhanced stealth abilities and minor invisibility
4. Pendant of Life (4000 gold) - Stores healing energy for emergency use
5. Crystal of Knowledge (1000 gold) - Contains ancient magical knowledge and spells

Personality:
- Mysterious and cryptic in speech
- Knowledgeable about magical items and their history
- Friendly but maintains an air of otherworldly detachment
- Always speaks in a calm, measured tone
- Has a dry sense of humor

Trading Rules:
- Only accepts gold or trades with other magical items
- All prices are negotiable within reason
- Offers magical item identification services
- Can provide historical information about items
- May trade information for information`;

const npc = new Conversation('0-0');

// Initial greeting
npc.addNode({
    id: '0-0',
    text: 'Ah, welcome to The Wandering Wonder, seeker of magical treasures. How may I assist you today?',
    options: [
        {
            text: 'Show me your items',
            nextNodeId: '1-0',
        },
        {
            text: 'I need item identification',
            nextNodeId: '2-0',
        },
        {
            text: 'Tell me about yourself',
            nextNodeId: '3-0',
        },
        {
            text: 'question',
            nextNodeId: '0-0',
            onSelect: () => npc.setFlag('question', true)
        },
        
        {
            text: 'Goodbye',
            nextNodeId: '9-0',
        },
        {
            text: 'other',
            nextNodeId: '0-0'
        }
    ]
});

// Items branch
npc.addNode({
    id: '1-0',
    text: 'Indeed, I have several remarkable artifacts available today. Which catches your interest?\n\n' +
          '1. Ring of Whispers - 2000 gold\n' +
          '2. Staff of the Forest - 5000 gold\n' +
          '3. Cloak of Shadows - 3000 gold\n' +
          '4. Pendant of Life - 4000 gold\n' +
          '5. Crystal of Knowledge - 1000 gold',
    options: [
        {
            text: 'Ring of Whispers',
            nextNodeId: '1-1'
        },
        {
            text: 'Staff of the Forest',
            nextNodeId: '1-2'
        },
        {
            text: 'Cloak of Shadows',
            nextNodeId: '1-3'
        },
        {
            text: 'Pendant of Life',
            nextNodeId: '1-4'
        },
        {
            text: 'Crystal of Knowledge',
            nextNodeId: '1-5'
        },
        {
            text: 'question',
            nextNodeId: '1-0',
            onSelect: () => npc.setFlag('question', true)
        },
        {
            text: 'other',
            nextNodeId: '1-0'
        }
    ]
});

// Item details nodes
npc.addNode({
    id: '1-1',
    text: 'Ah, the Ring of Whispers. A subtle but powerful artifact. Would you like to purchase it for 2000 gold?',
    options: [
        {
            text: 'Yes',
            nextNodeId: '1-6'
        },
        {
            text: 'No',
            nextNodeId: '1-0'
        },
        {
            text: 'question',
            nextNodeId: '1-1',
            onSelect: () => npc.setFlag('question', true)
        },
        {
            text: 'other',
            nextNodeId: '1-1'
        }
    ]
});

npc.addNode({
    id: '1-2',
    text: 'The Staff of the Forest, a truly magnificent piece. Shall we discuss its purchase for 5000 gold?',
    options: [
        {
            text: 'Yes',
            nextNodeId: '1-6'
        },
        {
            text: 'No',
            nextNodeId: '1-0'
        },
        {
            text: 'question',
            nextNodeId: '1-2',
            onSelect: () => npc.setFlag('question', true)
        },
        {
            text: 'other',
            nextNodeId: '1-2'
        }
    ]
});

npc.addNode({
    id: '1-3',
    text: 'The Cloak of Shadows, perfect for those who prefer... discretion. Would you like to acquire it for 3000 gold?',
    options: [
        {
            text: 'Yes',
            nextNodeId: '1-6'
        },
        {
            text: 'No',
            nextNodeId: '1-0'
        },
        {
            text: 'question',
            nextNodeId: '1-3',
            onSelect: () => npc.setFlag('question', true)
        },
        {
            text: 'other',
            nextNodeId: '1-3'
        }
    ]
});

npc.addNode({
    id: '1-4',
    text: 'The Pendant of Life, a wise choice for the cautious adventurer. Shall we proceed with the purchase for 4000 gold?',
    options: [
        {
            text: 'Yes',
            nextNodeId: '1-6'
        },
        {
            text: 'No',
            nextNodeId: '1-0'
        },
        {
            text: 'question',
            nextNodeId: '1-4',
            onSelect: () => npc.setFlag('question', true)
        },
        {
            text: 'other',
            nextNodeId: '1-4'
        }
    ]
});

npc.addNode({
    id: '1-5',
    text: 'The Crystal of Knowledge, a bargain at 1000 gold for those seeking ancient wisdom. Would you like to purchase it?',
    options: [
        {
            text: 'Yes',
            nextNodeId: '1-6'
        },
        {
            text: 'No',
            nextNodeId: '1-0'
        },
        {
            text: 'question',
            nextNodeId: '1-5',
            onSelect: () => npc.setFlag('question', true)
        },
        {
            text: 'other',
            nextNodeId: '1-5'
        }
    ]
});

npc.addNode({
    id: '1-6',
    text: 'Excellent choice! The item is yours. Would you like to see my other wares?',
    options: [
        {
            text: 'Yes',
            nextNodeId: '1-0'
        },
        {
            text: 'No',
            nextNodeId: '0-0'
        },
        {
            text: 'other',
            nextNodeId: '1-6'
        }
    ]
});

// Item identification branch
npc.addNode({
    id: '2-0',
    text: 'Ah, seeking knowledge about a mysterious item? I can help identify its properties for a modest fee of 100 gold. Shall we proceed?',
    options: [
        {
            text: 'Yes',
            nextNodeId: '2-1'
        },
        {
            text: 'No',
            nextNodeId: '0-0'
        },
        {
            text: 'question',
            nextNodeId: '2-0',
            onSelect: () => npc.setFlag('question', true)
        },
        {
            text: 'other',
            nextNodeId: '2-0'
        }
    ]
});

npc.addNode({
    id: '2-1',
    text: 'Very well. Please describe the item you wish to identify.',
    options: [
        {
            nextNodeId: '2-2'
        }
    ]
});

npc.addNode({
    id: '2-2',
    text: 'Fascinating... Would you like to know more about this item?',
    options: [
        {
            text: 'Yes',
            nextNodeId: '2-3',
            onSelect: () => npc.setFlag('question', true)
        },
        {
            text: 'No',
            nextNodeId: '0-0'
        },
        {
            text: 'other',
            nextNodeId: '2-2'
        }
    ]
});

npc.addNode({
    id: '2-3',
    text: 'Is there anything else you\'d like to know about the item?',
    options: [
        {
            text: 'Yes',
            nextNodeId: '2-3',
            onSelect: () => npc.setFlag('question', true)
        },
        {
            text: 'No',
            nextNodeId: '0-0'
        }
    ]
});

// Personal history branch
npc.addNode({
    id: '3-0',
    text: 'Ah, curious about the keeper of these magical wares? What would you like to know?',
    options: [
        {
            text: 'Your background',
            nextNodeId: '3-1',
            onSelect: () => npc.setFlag('question', true)
        },
        {
            text: 'Your travels',
            nextNodeId: '3-2',
            onSelect: () => npc.setFlag('question', true)
        },
        {
            text: 'Your knowledge',
            nextNodeId: '3-3',
            onSelect: () => npc.setFlag('question', true)
        },
        {
            text: 'Back',
            nextNodeId: '0-0'
        },
        {
            text: 'other',
            nextNodeId: '3-0'
        }
    ]
});

npc.addNode({
    id: '3-1',
    text: 'Would you like to know more about my past?',
    options: [
        {
            text: 'Yes',
            nextNodeId: '3-1',
            onSelect: () => npc.setFlag('question', true)
        },
        {
            text: 'No',
            nextNodeId: '0-0'
        },
        {
            text: 'other',
            nextNodeId: '0-0'
        }
    ]
});

npc.addNode({
    id: '3-2',
    text: 'Would you like to hear more about my travels?',
    options: [
        {
            text: 'Yes',
            nextNodeId: '3-2',
            onSelect: () => npc.setFlag('question', true)
        },
        {
            text: 'No',
            nextNodeId: '0-0'
        },
        {
            text: 'other',
            nextNodeId: '0-0'
        }
    ]
});

npc.addNode({
    id: '3-3',
    text: 'Would you like to learn more about my magical expertise?',
    options: [
        {
            text: 'Yes',
            nextNodeId: '3-3',
            onSelect: () => npc.setFlag('question', true)
        },
        {
            text: 'No',
            nextNodeId: '0-0'
        },
        {
            text: 'other',
            nextNodeId: '0-0'
        }
    ]
});

// Farewell node
npc.addNode({
    id: '9-0',
    text: 'May your path be enlightened by wisdom. Until we meet again...',
    onEnter: () => {
        npc.updateStatus(ConversationStatus.Completed)
    },
    options: []
});

export default npc;