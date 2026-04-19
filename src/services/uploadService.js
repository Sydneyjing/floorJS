import { post } from '@/utils/request';

/**
 * 文件上传相关 API
 * 注意：接口路径为示例，对接后端时请替换为实际路径
 */
export const uploadService = {
    /**
     * 上传图片
     * @param {File} file - 文件对象
     * @param {object} [options] - 额外参数
     * @param {function} [onProgress] - 上传进度回调
     * @returns {Promise<{url: string, fileName: string}>}
     */
    uploadImage(file, options = {}, onProgress) {
        const formData = new FormData();
        formData.append('file', file);

        // 附加额外参数
        Object.entries(options).forEach(([key, value]) => {
            formData.append(key, value);
        });

        return post('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: onProgress
                ? (progressEvent) => {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );
                    onProgress(percent);
                }
                : undefined,
        });
    },

    /**
     * 批量上传图片
     * @param {File[]} files - 文件数组
     * @returns {Promise<Array<{url: string, fileName: string}>>}
     */
    uploadImages(files) {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append('files', file);
        });

        return post('/upload/images', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};
