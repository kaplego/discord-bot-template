declare const logData: {
	[key: number]: Log;
};

type HTMLLog = Log & {
	htmlMessage: string;
};
