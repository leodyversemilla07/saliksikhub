<?php

namespace App;

enum DecisionType: string
{
    case ACCEPT = 'Accept';
    case MINOR_REVISION = 'Minor Revision';
    case MAJOR_REVISION = 'Major Revision';
    case REJECT = 'Reject';
}
