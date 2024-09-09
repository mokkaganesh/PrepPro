import { serial, varchar,text, pgTable} from "drizzle-orm/pg-core";


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