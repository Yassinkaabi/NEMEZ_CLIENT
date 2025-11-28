import { Card } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import '../../styles/admin.css';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: string;
}

const StatCard = ({ title, value, icon, trend, color = '#1890ff' }: StatCardProps) => {
    return (
        <Card className="stat-card" bordered={false}>
            <div className="stat-card-content">
                <div className="stat-card-info">
                    <p className="stat-card-title">{title}</p>
                    <h2 className="stat-card-value">{value}</h2>
                    {trend && (
                        <div className={`stat-card-trend ${trend.isPositive ? 'positive' : 'negative'}`}>
                            {trend.isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                            <span>{Math.abs(trend.value)}%</span>
                        </div>
                    )}
                </div>
                <div className="stat-card-icon" style={{ backgroundColor: `${color}15`, color }}>
                    {icon}
                </div>
            </div>
        </Card>
    );
};

export default StatCard;
