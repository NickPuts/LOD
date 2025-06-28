<script lang="ts">
  export let player;
  export let keeperInfo;
</script>

<style>
  .player-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 10px;
    border-bottom: 1px solid #eee;
  }

  .player-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .avatar {
    height: 30px;
    width: 30px;
    border-radius: 50%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .keeper-info {
    font-size: 0.8em;
    color: #777;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: right;
  }

  .keeper-info span {
    line-height: 1.2;
  }
</style>

<div class="player-row">
  <div class="player-info">
    <div class="avatar" style="{player.avatar}"></div>
    <div>
      <strong>{player.nam
