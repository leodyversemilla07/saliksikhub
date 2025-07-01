<?php

namespace App;

enum ManuscriptStatus: string
{
    case SUBMITTED = 'Submitted';
    case UNDER_REVIEW = 'Under Review';
    case MINOR_REVISION = 'Minor Revision';
    case MAJOR_REVISION = 'Major Revision';
    case ACCEPTED = 'Accepted';
    case IN_COPYEDITING = 'Copyediting';
    case AWAITING_APPROVAL = 'Awaiting Approval';
    case READY_TO_PUBLISH = 'Ready to Publish';
    case REJECTED = 'Rejected';
    case PUBLISHED = 'Published';
}
