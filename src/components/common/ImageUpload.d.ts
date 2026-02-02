import React from 'react';

export interface ImageUploadProps {
    /** 当前图片URL */
    value?: string;
    /** 图片URL变更回调 */
    onChange?: (url: string | undefined) => void;
    /** 最大宽度限制(px)，null表示不限制 */
    maxWidth?: number | null;
    /** 最大高度限制(px)，null表示不限制 */
    maxHeight?: number | null;
    /** 最大文件大小(KB)，null表示不限制，默认500KB */
    maxSize?: number | null;
    /** 提示文字 */
    placeholder?: string;
    /** 是否禁用 */
    disabled?: boolean;
}

declare const ImageUpload: React.FC<ImageUploadProps>;
export default ImageUpload;

