<?php

namespace App;

enum ReviewRecommendation: string
{
    case ACCEPT = 'accept';
    case MINOR_REVISION = 'minor_revision';
    case MAJOR_REVISION = 'major_revision';
    case REJECT = 'reject';

    public function label(): string
    {
        return match ($this) {
            self::ACCEPT => 'Accept',
            self::MINOR_REVISION => 'Minor Revision',
            self::MAJOR_REVISION => 'Major Revision',
            self::REJECT => 'Reject',
        };
    }

    public function color(): string
    {
        return match ($this) {
            self::ACCEPT => 'green',
            self::MINOR_REVISION => 'blue',
            self::MAJOR_REVISION => 'yellow',
            self::REJECT => 'red',
        };
    }
}
