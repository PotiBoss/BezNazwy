import items from "./Items.js";

export default class Inventory
{
	constructor(player)
	{

		this.mainScene = player.scene;
		
		this.inventory = player.inventory;
		this.myPlayer = player;
		this.selectedItemToCraft = 0;
		this.craftableItems = [];
	}

	updateItems()
	{
		this.craftableItems = [];

		let craftables =  Object.keys(items).filter(i => items[i].materials); // zwraca tylko przedmioty ze zdefiniowanymi materialami
		for(let i = 0; i < craftables.length; i++)
		{
			const craftableName = craftables[i];
			const craftableMaterials = items[craftableName].materials;

			let lastMaterial = '';
			let materialDetails = [];
			let isCraftable = true;

			craftableMaterials.forEach(material => {
				this.quantity = (lastMaterial === material) ? this.quantity-1 : this.inventory.getItemQuantity(material);
				let availableMaterial = (this.quantity > 0)
				materialDetails.push({name:material, frame:items[material].frame, availableMaterial});
				lastMaterial = material;
				if(!availableMaterial) isCraftable = false;
			});
			this.craftableItems.push({name:craftableName, frame:items[craftableName].frame, materialDetails, isCraftable});
		}
	}

	craft(selected)
	{
		let selectedItem = this.craftableItems[selected];
		if(selectedItem.isCraftable)
		{
			this.inventory.addItem({name: selectedItem.name, quantity: 1});
			selectedItem.materialDetails.forEach(materialDetail => this.inventory.removeItem(materialDetail.name));
			return true;
		}
		return false;
	}
}