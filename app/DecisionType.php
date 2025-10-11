<?php

namespace App;

enum DecisionType: string
{
    case ACCEPT = 'accept';
    case MINOR_REVISION = 'minor_revision';
    case MAJOR_REVISION = 'major_revision';
    case REJECT = 'reject';
    case DESK_REJECT = 'desk_reject';
    case CONDITIONAL_ACCEPT = 'conditional_accept';

    /**
     * Get human-readable label for the decision type
     */
    public function label(): string
    {
        return match ($this) {
            self::ACCEPT => 'Accept',
            self::MINOR_REVISION => 'Minor Revision',
            self::MAJOR_REVISION => 'Major Revision',
            self::REJECT => 'Reject',
            self::DESK_REJECT => 'Desk Reject',
            self::CONDITIONAL_ACCEPT => 'Conditional Accept',
        };
    }

    /**
     * Get color for UI display
     */
    public function color(): string
    {
        return match ($this) {
            self::ACCEPT => 'green',
            self::MINOR_REVISION => 'blue',
            self::MAJOR_REVISION => 'yellow',
            self::REJECT => 'red',
            self::DESK_REJECT => 'red',
            self::CONDITIONAL_ACCEPT => 'emerald',
        };
    }

    /**
     * Get description of the decision type
     */
    public function description(): string
    {
        return match ($this) {
            self::ACCEPT => 'Manuscript is accepted for publication',
            self::MINOR_REVISION => 'Manuscript requires minor revisions (typically 30 days)',
            self::MAJOR_REVISION => 'Manuscript requires substantial revisions (typically 60-90 days)',
            self::REJECT => 'Manuscript is rejected after peer review',
            self::DESK_REJECT => 'Manuscript is rejected without peer review',
            self::CONDITIONAL_ACCEPT => 'Manuscript is accepted pending very minor corrections',
        };
    }

    /**
     * Get the resulting manuscript status for this decision
     */
    public function resultingStatus(): \App\ManuscriptStatus
    {
        return match ($this) {
            self::ACCEPT => \App\ManuscriptStatus::ACCEPTED,
            self::MINOR_REVISION => \App\ManuscriptStatus::MINOR_REVISION_REQUIRED,
            self::MAJOR_REVISION => \App\ManuscriptStatus::MAJOR_REVISION_REQUIRED,
            self::REJECT => \App\ManuscriptStatus::REJECTED,
            self::DESK_REJECT => \App\ManuscriptStatus::DESK_REJECTED,
            self::CONDITIONAL_ACCEPT => \App\ManuscriptStatus::CONDITIONALLY_ACCEPTED,
        };
    }
}
