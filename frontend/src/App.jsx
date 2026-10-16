import AppRoutes from './routes/AppRoutes'
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function App() {
    const GOOGLE_CLIENT_ID = "791448851004-7uv4pq1unmirf1pphg8d96mlfmggjql5.apps.googleusercontent.com";

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <AppRoutes />
        </GoogleOAuthProvider>
    );
}