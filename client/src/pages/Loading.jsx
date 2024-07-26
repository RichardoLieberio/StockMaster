import { InfinitySpin } from "react-loader-spinner";

function Loading() {
    return (
        <div className="loading">
            <InfinitySpin width="160" color="var(--dark-text-)" />
        </div>
    );
}

export default Loading;