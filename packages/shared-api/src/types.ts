export type UserRole = 'admin' | 'teacher' | 'student';

export interface Profile {
    id: string;
    email: string;
    full_name?: string;
    role: UserRole;
    permissions?: Record<string, any>;
    created_at: string;
}

export interface Grade {
    id: number;
    name: string;
    created_at: string;
}

export interface Course {
    id: number;
    grade_id: number;
    name: string;
    created_at: string;
}

export interface Unit {
    id: number;
    course_id: number;
    name: string;
    created_at: string;
}

export interface Topic {
    id: number;
    unit_id: number;
    name: string;
    base_content?: string;
    created_at: string;
}

export interface LearningOutcome {
    id: number;
    topic_id: number;
    code: string;
    description: string;
    created_at: string;
}

export interface Question {
    id: number;
    learning_outcome_id: number;
    author_id?: string;
    content: string;
    image_url?: string;
    difficulty_level: 1 | 2 | 3 | 4 | 5;
    tags?: string[];
    created_at: string;
}

export interface Option {
    id: number;
    question_id: number;
    option_text: string;
    is_correct: boolean;
    created_at: string;
}
