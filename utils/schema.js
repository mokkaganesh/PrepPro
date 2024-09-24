import { serial, varchar,text,json, pgTable} from "drizzle-orm/pg-core";


export const MockInterview =pgTable('mockInterview', {
    id:serial('id').primaryKey(),
    jsonMockResp:text('jsonMockResp').notNull(),
    jopPosition:varchar('jopPosition' ).notNull(),
    jopDesc:varchar('jopDesc').notNull(),
    jopExperience:varchar('jopExperience').notNull(),
    createdBy:varchar('createdBy').notNull(),
    createdAt:varchar('createdAt'),
    mockId:varchar('mockId').notNull(),
})                   


export const UserAnswer =pgTable('userAnswer', {
    id:serial('id').primaryKey(),
    mockIdRef:varchar('mockId').notNull(),
    question:varchar('question').notNull(),
    correctAns:text('correctAns'),
    userAns:text('userAns'),
    feedback:text('feedback'),
    rating:varchar('rating'),
    userEmail:varchar('userEmail'),
    createdAt:varchar('createdAt'),
})

export const MockExam = pgTable('mockExam',{
    id:serial('id').primaryKey(),
    mockExamId:varchar('mockId').notNull(),
    createdAt:varchar('createdAt'),
    createdBy:varchar('createdBy').notNull(),
    examQuestions: json('examQuestions') // Adding JSON column for exam questions
});

// npm run db:push 
//to add the database 