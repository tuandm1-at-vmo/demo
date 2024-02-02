/**
 * A utility class for downloading files via streaming.
 */
class StreamSaverUtils {
    /**
     * Starts downloading a file via streaming.
     *
     * @param {string | URL | Request} request request.
     * @param {RequestInit | undefined} init request's settings.
     * @param {string | undefined} filename file name.
     * @param {string} mitm man-in-the-middle address.
     * @see https://github.com/jimmywarting/StreamSaver.js
     */
    static start(request, init, filename = "file.txt", mitm = "mitm.html") {
        // Check if the browser supports writable streams
        if (window.WritableStream) {
            streamSaver.mitm = mitm;
            fetch(request, init)
                .then((response) => {
                    const readableStream = response.body;
                    const writeStream = streamSaver.createWriteStream(
                        filename,
                        {
                            size: response.headers.get("content-length") || 0, // Optional: You can use the content-length header if available
                        },
                    );

                    if (readableStream.pipeTo) {
                        return readableStream
                            .pipeTo(writeStream)
                            .then(() => writeStream.close());
                    }

                    const reader = readableStream.getReader().read();
                    const writer = writeStream.getWriter();
                    const pump = async () => {
                        return reader.then((res) =>
                            res.done
                                ? writer.close()
                                : writer.write(res.value).then(pump),
                        );
                    };
                    return pump();
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        } else {
            console.error("WritableStream is not supported in this browser.");
        }
    }
}
