declare type Log = {
    date: Date;
    dateString: string;
    level: 'LOG' | 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
    paddedLevel: string;
    message: string;
    textMessage: string;
    htmlMessage?: string;
    args: any[];
};

type LogEvents = {
    logAdd: (log: Log) => void;
};
