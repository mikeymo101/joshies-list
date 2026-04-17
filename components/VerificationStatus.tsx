import Badge from './ui/Badge';

interface VerificationStatusProps {
  status: 'pending' | 'approved' | 'rejected';
}

const labels = {
  pending: 'Pending Verification',
  approved: 'Verified',
  rejected: 'Rejected',
};

export default function VerificationStatus({ status }: VerificationStatusProps) {
  const variant = {
    pending: 'warning' as const,
    approved: 'success' as const,
    rejected: 'danger' as const,
  };

  return <Badge variant={variant[status]}>{labels[status]}</Badge>;
}
