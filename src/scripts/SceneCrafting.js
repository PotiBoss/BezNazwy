
export default class SceneInventory extends Phaser.Scene
{
	constructor()
	{
		super('SceneCrafting');
	}

	init(scene)
	{
		this.craftingSlots = [];
		let { mainScene } = scene;
		this.mainScene = mainScene;
		this.crafting = this.mainScene.myPlayer.crafting;
		//this.crafting.inventory.subscribe(() => this.updateCraftingSlots()); //winowajca
		this.crafting.selected = 0;
	}

	create()
	{
		this.updateCraftingSlots();

		// Wybor itemu do craftowania
		this.input.on('wheel', (pointer, spriteObject, x, y, z) => {
			this.crafting.selected = Math.max((0, this.crafting.selected + (y > 0 ? 1 : -1)) % this.crafting.craftableItems.length);
			if(this.crafting.selected < 0) this.crafting.selected = this.crafting.craftableItems.length - 1;
			this.updateSelected();
		});

		// Craftowanie
		this.input.keyboard.on('keydown-V', () =>{
			if(this.crafting.craft(this.crafting.selected))
			{
			this.craftingSlots.forEach(slot => slot.destroy());
			this.updateCraftingSlots();
			this.scene.stop();
			this.mainScene.myPlayer.healthState = 0; // wlaczenie movementu
			}
		});
	}

	updateCraftingSlots()
	{

		this.crafting.updateItems();
		let y = 25;
		let x = 25;
		
		for(let i = 0; i < this.crafting.craftableItems.length; i++) //item wynikowy
		{
			if(this.craftingSlots[i]) this.refreshCraftingSlot(this.craftingSlots[i]);
			const currentCraftableItem = this.crafting.craftableItems[i];
			let craftingSlot = this.add.sprite(25, 100 + y * i, 'items', 11);
			this.craftingSlots.push(craftingSlot);
			this.craftingSlots[i].item = this.add.sprite(25, 100 + y * i, 'items', currentCraftableItem.frame);
			this.craftingSlots[i].item.tint = currentCraftableItem.isCraftable ? 0xffffff : 0x555555;

			this.craftingSlots[i].materials = [];
			for(let j = 0; j < currentCraftableItem.materialDetails.length; j++)
			{
				const materialItem = currentCraftableItem.materialDetails[j];
				this.craftingSlots[i].materials[j] = this.add.sprite(60 + x * j, 100 + y * i, 'items', materialItem.frame);
				this.craftingSlots[i].materials[j].tint = materialItem.availableMaterial ? 0xffffff : 0x555555; 
			}
		}
		this.updateSelected();
	}

	refreshCraftingSlot(craftingSlot)
	{
		craftingSlot.materials.forEach(material => material.destroy());
		craftingSlot.item.destroy();
		craftingSlot.destroy();
	}

	updateSelected()
	{
		for(let i = 0; i < this.crafting.craftableItems.length; i++){
			this.craftingSlots[i].tint = this.crafting.selected === i ? 0xffff00 : 0xffffff;
		}
	}
}

