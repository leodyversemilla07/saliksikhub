<?php

namespace App;

enum ReviewStatus: string
{
    case INVITED = 'invited';
    case ACCEPTED = 'accepted';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
    case DECLINED = 'declined';

    public function label(): string
    {
        return match ($this) {
            self::INVITED => 'Invited',
            self::ACCEPTED => 'Accepted',
            self::IN_PROGRESS => 'In Progress',
            self::COMPLETED => 'Completed',
            self::DECLINED => 'Declined',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::INVITED => 'yellow',
            self::ACCEPTED => 'blue',
            self::IN_PROGRESS => 'indigo',
            self::COMPLETED => 'green',
            self::DECLINED => 'red',
        };
    }
}
