import { ref } from 'vue';
import { assetUrl } from '../utils/assets.js'

const songs = ref([
    {
        title: '发如雪',
        artist: '周杰伦',
        url: assetUrl('/music/发如雪-周杰伦.mp3')
    },
    {
        title: '蝴蝶',
        artist: '陶喆',
        url: assetUrl('/music/蝴蝶-陶喆.mp3')
    },
    {
        title: 'Cruel Summer',
        artist: 'Taylor Swift',
        url: assetUrl('/music/Cruel Summer-Taylor Swift.mp3')
    },
    {
        title: '愿与愁',
        artist: '林俊杰',
        url: assetUrl('/music/愿与愁-林俊杰.mp3')
    },
    {
        title: '乌鸦',
        artist: '许嵩',
        url: assetUrl('/music/乌鸦-许嵩.mp3')
    },
    {
        title: '改变自己',
        artist: '王力宏',
        url: assetUrl('/music/改变自己-王力宏.mp3')
    },
    {
        title: '春风吹',
        artist: '方大同',
        url: assetUrl('/music/春风吹-方大同.mp3')
    },
    {
        title: '孤高曼波',
        artist: '',
        url: assetUrl('/music/孤高曼波.mp3')
    }
]);

export { songs };
