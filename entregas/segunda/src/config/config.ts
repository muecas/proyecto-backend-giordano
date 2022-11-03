// App Configuration Type
type AppConfiguration = {
	[key: string]: boolean,
	IS_ADMIN: boolean
};

// Configuration
const config: AppConfiguration = {
	IS_ADMIN : true
};

export { AppConfiguration };
export default config;