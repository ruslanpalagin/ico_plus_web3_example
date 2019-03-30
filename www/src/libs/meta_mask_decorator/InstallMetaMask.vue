<template>
  <div class="wrapper">
    <p>
      You have to install MetaMask and restart this application
    </p>
    <p>
      <a href="https://metamask.io/" target="_blank">
        <el-button type="primary">Install</el-button>
      </a>
    </p>

    <p>
      Is MetaMask ready?
    </p>

    <p>
      <a href="/">
        <el-button type="success">Restart Application</el-button>
      </a>
    </p>
  </div>
</template>

<script>
  export default {
    name: 'InstallMetaMask',
  }
</script>

<style lang="scss" scoped>
  .wrapper{
    display: block;
    max-width: 500px;
    margin: 50px auto 0 auto;
    text-align: center;

    p{
      margin-bottom: 15px;
    }
  }
</style>
