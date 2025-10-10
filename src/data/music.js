import { ref } from 'vue';

const songs = ref([
    {
        title: '发如雪',
        artist: '周杰伦',
        cover: 'https://pic.baike.soso.com/ugc/baikepic2/0/ori-20230213211625-2132552379_jpeg_606_663_40502.jpg/800',
        url: '/src/assets/music/发如雪-周杰伦.mp3'
    },
    {
        title: '蝴蝶',
        artist: '陶喆',
        cover: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.LHN6bGVugZM7nklH3cNI-wHaEo?w=474&h=296&c=7&bgcl=fffffe&r=0&o=6&pid=23.1&ucfimg=1',
        url: '/src/assets/music/蝴蝶-陶喆.mp3'
    }, 
    {
        title: 'Cruel Summer',
        artist: 'Taylor Swift',
        cover: 'https://img.rapzh.com/rapgod.swiftcarrot.com/d75ab2fd22b3cf7999c7445f3b73f1e255e2a59b_400x400.jpg',
        url: '/src/assets/music/Cruel Summer-Taylor Swift.mp3'
    },
    {
        title: '愿与愁',
        artist: '林俊杰',
        cover: 'https://ts4.tc.mm.bing.net/th/id/OIP-C.6KMeiNw5BUEXi6cAFWN2DwHaHa?r=0&cb=thfc1ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
        url: '/src/assets/music/愿与愁-林俊杰.mp3'
    },
    {
        title: '乌鸦',
        artist: '许嵩',
        cover: 'https://ts2.tc.mm.bing.net/th/id/OIP-C.zG4CKdHHG0RpCCxdoje66gHaHa?r=0&cb=thfc1ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
        url: '/src/assets/music/乌鸦-许嵩.mp3'
    },
    {
        title: '改变自己',
        artist: '王力宏',
        cover: 'https://ts1.tc.mm.bing.net/th/id/R-C.5366514c2d60601a5fc7afd965ce2e38?rik=BNC7CoP37X9WpA&riu=http%3a%2f%2fp2.music.126.net%2flHab-TuxFpGuCCv661i7eg%3d%3d%2f109951163095170102.jpg&ehk=o7%2b%2bi23C4VfyGAuDfD95MP2RsI%2fzR8%2bm9%2fH1qSDvIL0%3d&risl=&pid=ImgRaw&r=0',
        url: '/src/assets/music/改变自己-王力宏.mp3'
    },
    {
        title: '春风吹',
        artist: '方大同',
        cover: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.wTH5phSDHyTNq51DwS7JKwHaHa?r=0&cb=thfc1ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3',
        url: '/src/assets/music/春风吹-方大同.mp3'
    },
    {
        title: '孤高曼波',
        artist: '',
        cover: 'https://p2.music.126.net/z150EpOTNipDBOMNnAJr6A==/109951169783176506.jpg',
        url: '/src/assets/music/孤高曼波.mp3'
    }
]);

export { songs };