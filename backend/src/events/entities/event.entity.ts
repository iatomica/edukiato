export interface CalendarEvent {
    id: string;
    institutionId: string;
    title: string;
    start: Date;
    end: Date;
    type: 'class' | 'workshop' | 'event';
    color: string;
    description?: string;
    creatorId?: string;
    sharedWith?: {
        scope: 'ALL' | 'COURSE' | 'INDIVIDUAL';
        targetIds?: string[];
    };
}
