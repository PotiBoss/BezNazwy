import items from "./Items";

export default class SceneInventory extends Phaser.Scene
{
	constructor()
	{
		super("SceneInventory");


		this.currentRows = 1;
		this.slotSpacing = 4;
		this.slotMargin = 8;
		this.tileSize = 32;
		this.offsetToRight = 590;
		
		this.inventorySlots = [];
	}

	init(scene)
	{
		let { mainScene } = scene;
		this.mainScene = mainScene;
		this.inventory = this.mainScene.myPlayer.inventory;
		this.maxColumns = this.inventory.maxColumns;
		this.maxRows = this.inventory.maxRows;
	}
	
	create()
	{
		this.refresh();
		this.input.keyboard.on('keydown-I', () => {
			this.currentRows = this.currentRows === 1 ? this.maxRows : 1;
			this.refresh();
		});

		this.input.setTopOnly(false);
		this.input.on("dragstart", ()=>{
			this.startingSlot = this.hoverSlot;
			this.inventorySlots[this.startingSlot].quantityText.destroy();
		})
		this.input.on("drag", (pointer, spriteObject, x, y) => {
			spriteObject.x = x;
			spriteObject.y = y;
		})
		this.input.on("dragend", () => {
			this.inventory.changeSlot(this.startingSlot, this.hoverSlot);
			this.refresh();
		})

	}

	refresh()
	{	
		this.inventorySlots.forEach(slot => this.refreshInventorySlot(slot));
		this.inventorySlots = [];
		for(let i = 0; i < this.maxColumns * this.currentRows; i++)
		{
			let x = this.offsetToRight + this.slotMargin + i % this.maxColumns * (this.tileSize + this.slotSpacing) + this.tileSize / 2;
			let y = this.slotMargin + this.tileSize / 2 + Math.floor(i / this.maxColumns) * (this.tileSize + this.slotSpacing);
			let inventorySlot = this.add.sprite(x, y, 'items', 11);

			inventorySlot.setInteractive();
			inventorySlot.on('pointerover', (pointer) =>{
				this.hoverSlot = i; // na ktorym indeksie ekwipunku jest myszka
			});


			let item = this.inventory.getItem(i);

			if(item)
			{
				inventorySlot.item = this.add.sprite(inventorySlot.x, inventorySlot.y, 'items', items[item.name].frame);
				inventorySlot.quantityText = this.add.text(inventorySlot.x + this.tileSize / 8, inventorySlot.y, item.quantity);

				//drag

				inventorySlot.depth = -1;
				inventorySlot.item.setInteractive();
				this.input.setDraggable(inventorySlot.item);
			}
			this.inventorySlots.push(inventorySlot);
		}
	}

	refreshInventorySlot(inventorySlot)
	{
		if(inventorySlot.item)
		{
			inventorySlot.item.destroy();
		}
		
		if(inventorySlot.quantityText)
		{
			inventorySlot.quantityText.destroy();
		}

		inventorySlot.destroy();
	}

	getTileSize()
	{
		return this.tileSize
	}
}