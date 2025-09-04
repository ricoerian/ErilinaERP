const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Planned': return 'bg-blue-100 text-blue-800';
            case 'In Progress': return 'bg-yellow-100 text-yellow-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Pending Assignment': return 'bg-gray-100 text-gray-800';
            case 'On The Way': return 'bg-blue-100 text-blue-800';
            case 'Delivered': return 'bg-green-100 text-green-800';
            case 'Failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
            {status}
        </span>
    );
};

export default StatusBadge