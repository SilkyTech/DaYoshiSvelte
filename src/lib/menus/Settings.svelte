<script lang="ts">
    import CurvedButton from "../component/CurvedButton.svelte";
    import Modal from "../component/Modal.svelte";
    import * as int from '../Internal' 
    import Toggle from '../component/Toggle.svelte'
    import { settings as _settings } from '../stores'
    let modal: Modal;

    let {
        potato
    } = _settings;


    export function open() {
        modal.openModal();
    }


    let settingsD = localStorage.getItem("settings")
    if (settingsD !== null) {
        let set = JSON.parse(settingsD);
        $potato.notifs = set?.potato?.notifs ?? true;
        $potato.petAnim = set?.potato?.petAnim ?? true;
    } else {
        $potato.notifs = true;
        $potato.petAnim = true;
        saveSettings()
    }

    function saveSettings() {
        localStorage.setItem("settings", JSON.stringify({potato: {...$potato}}))
        modal.closeModal();
    }
    
</script>



<Modal bind:this={modal}>
    <h1>Settings Menu</h1>
    <hr>
    <h3>Save Options:</h3>
    <CurvedButton onclick={() => setTimeout(() => {
        if (confirm("Are you sure you want to reset?")) {localStorage.removeItem("save"); location.reload()}
    }, 0)}>Reset Save</CurvedButton><br>
    <CurvedButton onclick={() => setTimeout(() => {
        int.save.loadSave(prompt("Save String: "))
        
    }, 0)
        }>Import Save</CurvedButton><br>
    <CurvedButton onclick={() => prompt(`Copy this:`, localStorage.getItem("save"))}>Export Save</CurvedButton><br>
    <h3>Potato PC options:</h3>
    <span class="option-label">Notifications at cursor: </span><Toggle bind:on={$potato.notifs}></Toggle><br>
    <span class="option-label">Pet animation: </span><Toggle bind:on={$potato.petAnim}></Toggle><br>
    <hr>
    <CurvedButton onclick={saveSettings}>Save Settings</CurvedButton>
</Modal>

