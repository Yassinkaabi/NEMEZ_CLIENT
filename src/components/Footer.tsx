import { Layout, Typography } from 'antd';
import { FacebookOutlined, InstagramOutlined, TikTokOutlined } from '@ant-design/icons';
import NewsletterSubscription from './NewsletterSubscription';

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

const Footer = () => {
    return (
        <div style={{ marginTop: 60 }}>
            <AntFooter style={{ background: '#374151', color: '#fff' }}>
            <NewsletterSubscription />

                    <div style={{ textAlign: 'center', marginTop: 40, paddingTop: 20, borderTop: '1px solid #4B5563' }}>
                        <Text style={{ color: '#9CA3AF' }}>
                        © {new Date().getFullYear()} NEMEZ Shop. Tous droits réservés.</Text>
                        <div style={{ marginTop: 10, fontSize: 24 }}>
                                <FacebookOutlined href='' style={{ color: '#9CA3AF', marginRight: 16, cursor: 'pointer' }} />
                                <InstagramOutlined href='' style={{ color: '#9CA3AF', marginRight: 16, cursor: 'pointer' }} />
                                <TikTokOutlined href='' style={{ color: '#9CA3AF', cursor: 'pointer' }} />
                            </div>
                    </div>
            </AntFooter>
        </div>
    );
};

export default Footer;