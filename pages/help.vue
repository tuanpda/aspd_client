<template>
  <div class="column">
    <div class="box">
      <div class="columns">
        <div class="column">
          <div class="control">
            <span style="color: #198754" class="icon is-small is-left">
              <i class="fab fa-youtube-square"></i>
            </span>
            <span style="font-weight: bold; color: #198754">
              Video Clip Hướng dẫn sử dụng phần mềm
            </span>
          </div>

          <hr class="navbar-divider" />

          <div class="" style="margin-top: 20px;">
            <div class="columns is-multiline">
              <div
                class="column is-one-quarter"
                v-for="(video, index) in processedVideos"
                :key="index"
              >
                <div class="video-container">
                  <iframe
                    width="100%"
                    height="200"
                    :src="`https://www.youtube.com/embed/${video.id}`"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  ></iframe>
                </div>
                <p class="has-text-centered has-text-weight-semibold" style="margin-top: 0.5rem;">
                  {{ video.title }}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      videoList: [
        {
          url: "https://www.youtube.com/watch?v=8WHu9QVsbCY",
          title: "Cách đăng nhập vào hệ thống EVSS"
        },
        {
          url: "https://youtu.be/R7XkOe0rwxs",
          title: "Cách kê khai bảo hiểm"
        },
        {
          url: "https://www.youtube.com/watch?v=LoRWZk-jzIE",
          title: "Tạo biên lai điện tử"
        },
        {
          url: "https://www.youtube.com/watch?v=1xjRNm4tU7g",
          title: "Tổng hợp báo cáo định kỳ"
        }
      ]
    };
  },

  computed: {
    processedVideos() {
      return this.videoList
        .map(video => {
          const match = video.url.match(/(?:v=|\.be\/)([\w\-]{11})/);
          if (match && match[1]) {
            return {
              id: match[1],
              title: video.title
            };
          }
          return null;
        })
        .filter(Boolean);
    }
  }
};
</script>

<style scoped>
.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  overflow: hidden;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
