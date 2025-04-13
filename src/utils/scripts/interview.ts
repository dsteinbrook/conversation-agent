import {Conversation, ConversationStatus} from '../conversationController';

//system prompt for question answering
export const systemPrompt = `You are conducting an interview for a forklift operator role in New Jersey. Answer the user's question about the role based on the following job description. If you are not able to answer, inform the user that you are not able to answer their question. Do not end your response with a question.

        Job Title: Forklift Operator

        Location: Jersey City, NJ / Trenton, NJ
        Company: [Company Name]
        Job Type: Full-time

        Job Description:
        We are seeking a reliable and safety-conscious Forklift Operator to join our team at [Company Name]. As a Forklift Operator, you will play a key role in ensuring smooth and efficient warehouse operations. You will be responsible for moving materials, loading/unloading shipments, and maintaining a safe working environment while operating various types of forklifts.

        Key Responsibilities:

        Operate sit-down and stand-up forklifts to move materials throughout the warehouse.
        Load and unload shipments from trucks and containers.
        Organize and stack inventory in designated areas to ensure efficient storage.
        Inspect and maintain forklift equipment to ensure it is in good working condition.
        Safely handle goods and materials, ensuring proper stacking and placement to prevent damage.
        Follow all safety protocols and comply with OSHA regulations.
        Assist with inventory control, including periodic stock counts and reporting discrepancies.
        Perform other warehouse duties as assigned.
        Qualifications:

        High school diploma or GED.
        Valid forklift certification (or willing to obtain upon hire).
        Prior experience operating forklifts in a warehouse or industrial setting preferred.
        Strong attention to detail and ability to maintain accurate records.
        Ability to work in a fast-paced environment and meet deadlines.
        Excellent communication and teamwork skills.
        Must be able to lift up to 50 lbs and stand for extended periods.
        Availability to work in Jersey City or Trenton, NJ.
        Working Conditions:

        Full-time position.
        Monday through Friday, with occasional overtime based on business needs.
        Warehouse environment with potential exposure to loud noise, temperature changes, and heavy machinery.
        Benefits:

        25 dollars/hour and overtime opportunities.
        Health, dental, and vision insurance.
        Paid time off (PTO) and holidays.
        401(k) with company match.
        Training and development opportunities.`;

const interview = new Conversation('0-0');


//setup interview script
interview.addNode({
    id: '0-0',
    text: 'Hello! Are you currently open to discussing the forklift operator role?',
    options: [
        {
            text: 'Yes',
            nextNodeId: '1-0',
        },
        {
            text: 'No',
            nextNodeId: '0-1',
        },
        {
            text: 'question',
            nextNodeId: '0-2',
            onSelect: () => interview.setFlag('question', true)
        },
        {
            text: 'other',
            nextNodeId: '0-2'
        }
    ]
});

interview.addNode({
    id: '0-1',
    text: 'No problem. Best of luck!',
    onEnter: () => {
        interview.updateStatus(ConversationStatus.Completed)
    },
    options: []

});

interview.addNode({
    id: '0-2',
    text: 'Are you currently open to discussing the forklift operator role?',
    options: [
        {
            text: 'Yes',
            nextNodeId: '1-0',
        },
        {
            text: 'No',
            nextNodeId: '0-1',
        },
        {
            text: 'question',
            nextNodeId: '0-2',
            onSelect: () => interview.setFlag('question', true)
        },
        {
            text: 'other',
            nextNodeId: '0-2'
        }
    ]
})

interview.addNode({
    id: '1-0',
    text: 'Excellent! Let\'s start with some basic information. What is your name?',
    onEnter: () => {
        interview.setFlag('collectName', true)
    },
    options: [
        {
            nextNodeId: '1-1',
        } 
    ]
});

interview.addNode({
    id: '1-1',
    text: `Nice to meet you, ${interview.getUserName()}! Which location are you applying for?`,
    options: [
        {
            text: 'Jersey City',
            nextNodeId: '2-0'
        },
        {
            text: 'Trenton',
            nextNodeId: '2-0'
        },
        {
            text: 'other',
            nextNodeId: '1-2'
        }
    ]
});

interview.addNode({
    id: '1-2',
    text: 'The locations we have available are Jersey City and Trenton. Do either of those work for you?',
    options: [
        {
            text: 'Jersey City',
            nextNodeId: '2-0',

        },
        {
            text: 'Trenton',
            nextNodeId: '2-0'
        },
        {
            text: 'No',
            nextNodeId: '0-1'
        },
        {
            text: 'question',
            nextNodeId: '1-2',
            onSelect: () => interview.setFlag('question', true)
        },
        {
            text: 'other',
            nextNodeId: '1-2'
        }
    ]
});

interview.addNode({
    id: '2-0',
    text: 'Excellent! Let\'s continue. Do you have a valid OSHA forklift certification?',
    options: [
        {
            text: 'Yes',
            nextNodeId: '3-0'
        },
        {
            text: 'No',
            nextNodeId: '2-1'
        },
        {
            text: 'question',
            nextNodeId: '2-0',
            onSelect: () => interview.setFlag('question', true)
        },
        {
            text: 'other',
            nextNodeId: '2-0'
        }
    ]
});

interview.addNode({
        id: '2-1',
        text: 'I\'m sorry, the role requires a valid OSHA certification.',
        onEnter: () => {
            interview.updateStatus(ConversationStatus.Completed)
        },
        options: []
});

interview.addNode({
    id: '3-0',
    text: 'The pay is 25 dollars/hour plus 1.5x overtime. Does that work for you?',
    options: [
       {
        text: 'Yes',
        nextNodeId: '4-0'
       },
       {
        text: 'No',
        nextNodeId: '0-1'
       },
       {
        text: 'other',
        nextNodeId: '3-0'
       } 
    ]
});

interview.addNode(
    {
        id: '4-0',
        text: 'Great! Now let\'s discuss your previous experience. Do you have at least one year of forklift operating experience?',
        options: [
            {
                text: 'Yes',
                nextNodeId: '4-1'
            },
            {
                text: 'No',
                nextNodeId: '4-2'
            },
            {
                text: 'other',
                nextNodeId: '4-3'
            }
        ]
    }
);

interview.addNode({
    id: '4-1',
    text: 'Tell me about your experience',
    options: [
        {
            nextNodeId: '5-0'
        }
    ]
});

interview.addNode({
    id: '4-2',
    text: 'Tell me about some of your other work experience.',
    options: [
        {
            nextNodeId: '5-0'
        }
    ]
});

interview.addNode({
    id: '4-3',
    text: 'Do you have at least one year of forklift operating experience?',
    options: [
        {
            text: 'Yes',
            nextNodeId: '4-1'
        },
        {
            text: 'No',
            nextNodeId: '4-2'
        },
        {
            text: 'other',
            nextNodeId: '4-3'
        }
    ]
});

interview.addNode({
    id: '5-0',
    text: 'Do you have any questions about the role?',
    options: [
        {
            text: 'No',
            nextNodeId: '6-1'
        },
        {
            text: 'question',
            nextNodeId: '5-1',
            onSelect: () => interview.setFlag('question', true)
        },
        {
            text: 'other',
            nextNodeId: '6-1'
        }
    ]
});

interview.addNode({
    id: '5-1',
    text: 'Do you have any other questions?',
    options: [
        {
            text: 'No',
            nextNodeId: '6-1'
        },
        {
            text: 'question',
            nextNodeId: '5-1',
            onSelect: () => interview.setFlag('question', true)
        },
        {
            text: 'other',
            nextNodeId: '6-1'
        }
    ]

});

interview.addNode({
    id: '6-1',
    text: 'Thank you for your time! You will receive an email shortly with a decision and next steps.',
    onEnter: () => {
        interview.updateStatus(ConversationStatus.Completed)
    },
    options: []
});

export default interview;