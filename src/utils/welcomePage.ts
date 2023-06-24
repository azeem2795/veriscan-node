/**
 * Welcome page for the application.
 * @author Yousuf Kalim
 */
import { APP_NAME } from '@config';

const welcomePage = `<!DOCTYPE html>
<html>
<head>
    <title>Welcome to the VeriScan API</title>
    <style>
        * {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
            'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        .Hero {
            text-align: center;
        }

        .Hero-logo {
            height: 40vmin;
            margin-bottom: 10px;
            filter: hue-rotate(110deg);
            animation: Hero-logo-spin infinite 20s linear;
        }

        @keyframes Hero-logo-spin {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

        .Hero-header {
            background-color: #0080ff;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: calc(10px + 2vmin);
            color: white;
        }

        .Hero-header p {
            font-size: 20px;
            line-height: 1.5;
            margin-bottom: 10px;
        }

        .Hero-header a {
            color: white;
            text-decoration: underline;
        }

        .Hero-header a:hover {
            color: #80c9ff;
        }
    </style>
</head>
<body>
<div class="app">
    <div class="Hero">
        <header class="Hero-header">
            <img src="https://cdn-icons-png.flaticon.com/512/5968/5968322.png" class="Hero-logo" alt="logo" />
            <h4>Welcome to VeriScan</h4>
            <p>This is the main route of VeriScan.</p>
            <p>If you are here by mistake, please visit <a href="https://getveriscan.com">getveriscan.com</a> for more information.</p>
        </header>
    </div>
</div>
</body>
</html>

`;

export default welcomePage;
