<template>
  <div>hello{{ num }}</div>
</template>
<script>
export default {
  data() {
    return {
      num: 1
    };
  },

  mounted() {
    setInterval(() => {
      this.num++;
    }, 1000);
  }
};
</script>
