import { Layout, Typography } from 'antd';
import MainPanel from './components/MainPanel/MainPanel';
import logo from './assets/passSmith-logo.png';
import './App.css';

const { Header, Content, Footer } = Layout;

export default function App() {
  return (
    <Layout style={{ minHeight: '100vh', width: '100%' }}>
      <Header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginLeft: '32px' }}>
          <img src={logo} alt="PassSmith Logo" className="app-logo" />
          <div>
            <Typography.Title level={4} style={{ margin: 0 }}>
              Pass<span style={{ color: '#1890ff' }}>Smith</span>
            </Typography.Title>
            <Typography.Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '-4px' }}>
              Never forget a strong password again.
            </Typography.Text>
          </div>
        </div>
      </Header>
      <Content className="app-content">
        <MainPanel />
      </Content>
      <Footer className="app-footer">
        <div>
          PassSmith • Forge strong, recallable passwords
        </div>
        <div className="footer-support">
          <a 
            href="https://buymeacoffee.com/gajith" 
            target="_blank" 
            rel="noopener noreferrer"
            className="support-link"
          >
            ☕ Support my work
          </a>
        </div>
      </Footer>
    </Layout>
  );
}
