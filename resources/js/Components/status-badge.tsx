import { BookOpen, Clock, Edit, CheckCircle, XCircle, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ManuscriptStatus } from '@/types/manuscript';
import { Badge } from './ui/badge';

interface ManuscriptStatusBadgeProps {
  status: ManuscriptStatus;
  className?: string;
}

export function StatusBadge({ status, className }: ManuscriptStatusBadgeProps) {
  // Helper function to get appropriate styles and icon for status
  const getStatusConfig = () => {
    switch (status) {
      case ManuscriptStatus.SUBMITTED:
        return {
          icon: <Edit className="h-3.5 w-3.5 mr-1" />,
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/30'
        };
      case ManuscriptStatus.UNDER_REVIEW:
        return {
          icon: <Clock className="h-3.5 w-3.5 mr-1" />,
          color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800/30'
        };
      case ManuscriptStatus.MINOR_REVISION:
        return {
          icon: <Edit className="h-3.5 w-3.5 mr-1" />,
          color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/30'
        };
      case ManuscriptStatus.MAJOR_REVISION:
        return {
          icon: <Edit className="h-3.5 w-3.5 mr-1" />,
          color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800/30'
        };
      case ManuscriptStatus.ACCEPTED:
        return {
          icon: <CheckCircle className="h-3.5 w-3.5 mr-1" />,
          color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800/30'
        };
      case ManuscriptStatus.IN_COPYEDITING:
        return {
          icon: <Edit className="h-3.5 w-3.5 mr-1" />,
          color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/30'
        };
      case ManuscriptStatus.AWAITING_AUTHOR_APPROVAL:
        return {
          icon: <Eye className="h-3.5 w-3.5 mr-1" />,
          color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/30'
        };
      case ManuscriptStatus.READY_FOR_PUBLICATION:
        return {
          icon: <BookOpen className="h-3.5 w-3.5 mr-1" />,
          color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/30'
        };
      case ManuscriptStatus.REJECTED:
        return {
          icon: <XCircle className="h-3.5 w-3.5 mr-1" />,
          color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800/30'
        };
      case ManuscriptStatus.PUBLISHED:
        return {
          icon: <BookOpen className="h-3.5 w-3.5 mr-1" />,
          color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 border-teal-200 dark:border-teal-800/30'
        };
      default:
        return {
          icon: <Clock className="h-3.5 w-3.5 mr-1" />,
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300 border-gray-200 dark:border-gray-700'
        };
    }
  };

  const { icon, color } = getStatusConfig();

  return (
    <Badge className={cn(color, className)}>
      {icon}
      {status}
    </Badge>
  );
}
