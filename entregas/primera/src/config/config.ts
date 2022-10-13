// Products type
import { PathLike } from "fs";

// App Configuration Type
type AppConfiguration = {
	[key: string]: boolean | PathLike,
	DATA_STORAGE: PathLike,
	IS_ADMIN: boolean
};

// Configuration
const config: AppConfiguration = {
	DATA_STORAGE : `${process.cwd()}/data`,
	IS_ADMIN     : false
};

export { AppConfiguration };
export default config;