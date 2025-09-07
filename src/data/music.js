import { ref } from 'vue';

const songs = ref([
    {
        title: '蝴蝶',
        artist: '陶喆',
        cover: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.LHN6bGVugZM7nklH3cNI-wHaEo?w=474&h=296&c=7&bgcl=fffffe&r=0&o=6&pid=23.1&ucfimg=1',
        url: '/src/assets/music/蝴蝶-陶喆.mp3'
    }, 
    {
        title: '发如雪',
        artist: '周杰伦',
        cover: 'https://pic.baike.soso.com/ugc/baikepic2/0/ori-20230213211625-2132552379_jpeg_606_663_40502.jpg/800',
        url: '/src/assets/music/发如雪-周杰伦.mp3'
    }
].reverse());

export { songs };
