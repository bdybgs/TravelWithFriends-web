

declare global {
    interface Window {
        ym: (id: number, action: string, target: string) => void;
    }
}

export const sendEvent = (action: string, target: string) => {
    const id = 97428533; 
    window.ym(id, action, target);
};
