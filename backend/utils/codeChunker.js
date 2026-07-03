/**
 * Utility to chunk code into manageable parts for analysis
 * Default: 1000 lines per chunk
 */

const CHUNK_SIZE = 1000; // lines per chunk

function chunkCode(content, fileName, language) {
    const lines = content.split('\n');
    const totalLines = lines.length;
    const chunks = [];

    // If file is small enough, return as single chunk
    if (totalLines <= CHUNK_SIZE) {
        chunks.push({
            chunkIndex: 0,
            totalChunks: 1,
            startLine: 1,
            endLine: totalLines,
            code: content,
            lineCount: totalLines,
            metadata: {
                fileName,
                language,
                chunkSize: totalLines
            }
        });
        return chunks;
    }

    // Split into chunks
    const totalChunks = Math.ceil(totalLines / CHUNK_SIZE);

    for (let i = 0; i < totalChunks; i++) {
        const startIndex = i * CHUNK_SIZE;
        const endIndex = Math.min((i + 1) * CHUNK_SIZE, totalLines);
        const chunkLines = lines.slice(startIndex, endIndex);

        chunks.push({
            chunkIndex: i,
            totalChunks,
            startLine: startIndex + 1,
            endLine: endIndex,
            code: chunkLines.join('\n'),
            lineCount: chunkLines.length,
            metadata: {
                fileName,
                language,
                chunkSize: chunkLines.length
            }
        });
    }

    return chunks;
}

function getChunkInfo(chunk) {
    return `${chunk.metadata.fileName} [${chunk.metadata.language}] - Lines ${chunk.startLine}-${chunk.endLine} (Chunk ${chunk.chunkIndex + 1}/${chunk.totalChunks})`;
}

module.exports = {
    chunkCode,
    getChunkInfo,
    CHUNK_SIZE
};
