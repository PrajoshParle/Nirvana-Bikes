const params = new URLSearchParams(window.location.search);
const selectedBike = params.get('bike');
if (selectedBike) {
    const bikeInput = document.getElementById('bikeName');
    if (bikeInput) {
        bikeInput.value = selectedBike.replace(/-/g, ' ');
    }
}
