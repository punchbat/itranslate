function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;

    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export { debounce };
