<?php

use App\DecisionType;
use App\ManuscriptStatus;

it('maps editorial decision types to manuscript statuses', function () {
    expect(DecisionType::ACCEPT->resultingStatus())->toBe(ManuscriptStatus::ACCEPTED);
    expect(DecisionType::MINOR_REVISION->resultingStatus())->toBe(ManuscriptStatus::MINOR_REVISION_REQUIRED);
    expect(DecisionType::MAJOR_REVISION->resultingStatus())->toBe(ManuscriptStatus::MAJOR_REVISION_REQUIRED);
    expect(DecisionType::REJECT->resultingStatus())->toBe(ManuscriptStatus::REJECTED);
    expect(DecisionType::DESK_REJECT->resultingStatus())->toBe(ManuscriptStatus::DESK_REJECTED);
    expect(DecisionType::CONDITIONAL_ACCEPT->resultingStatus())->toBe(ManuscriptStatus::CONDITIONALLY_ACCEPTED);
});
