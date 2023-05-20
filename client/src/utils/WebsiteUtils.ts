export const getUrl = () => {
    return process.env.REACT_APP_SERVER_MODE === 'PRODUCTION'
        ? process.env.REACT_APP_DEV_SERVER_URL
        : process.env.REACT_APP_DEV_LOCAL_URL
}
