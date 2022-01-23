

export default class Inventory
{
	constructor(scene)
	{
		this.items = 
		{
			//0: {name: 'pickaxe', quantity: 1},
			//2: {name: 'stone', quantity: 3}
		}
		this.observers = [];

		this.maxColumns = 10;
		this.maxRows = 3;

		this.scene = scene;

		this.currentItem = 0;

		this.addItem({name: 'speedHerb', quantity: 8})
		this.addItem({name: 'healthHerb', quantity: 8})
		this.addItem({name: 'damageHerb', quantity: 8})
		this.addItem({name: 'cooldownHerb', quantity: 8})
	}

	addItem(item)
	{
		let isInInventory = Object.keys(this.items).find(key => this.items[key].name === item.name);

		if(isInInventory)
		{
			this.items[isInInventory].quantity += item.quantity;
		}
		else 
		{
			for(let i = 0; i < this.maxColumns * this.maxRows; i++)
			{
				let occupiedSlot = this.items[i];
				if(!occupiedSlot)
				{
					this.items[i] = item;
					break;
				}
			}
		}
		this.broadcast();
	}

	removeItem(itemName)
	{
		let currentSlot = Object.keys(this.items).find(key => this.items[key].name === itemName)
		if(currentSlot){
			this.items[currentSlot].quantity--;
			if(this.items[currentSlot].quantity <= 0) delete this.items[currentSlot];
		}
		this.broadcast();
	}

	changeSlot(startingSlot, endingSlot)
	{
		if(startingSlot === endingSlot || this.items[endingSlot])
		{
			return;
		}
		this.items[endingSlot] = this.items[startingSlot];
		delete this.items[startingSlot];
		this.broadcast();
	}

	subscribe(fn)
	{
		this.observers.push(fn);
	}

	unsubscribe(fn)
	{
		this.observers = this.observers.filter(subscriber => subscriber !== fn);
	}

	broadcast()
	{
		this.observers.forEach(subscriber => subscriber());
	}

	getItem(gridNumber)
	{
		return this.items[gridNumber]
	}

	getItemQuantity(itemName)
	{
		return Object.values(this.items).filter(i => i.name === itemName).map(j => j.quantity).reduce((totalNumber, numberToAdd) => totalNumber + numberToAdd, 0); //kasper bylby dumny
	}

	drinkPotion(itemName)
	{
		switch(itemName)
		{
			case 'healthPotion':
				this.scene.myPlayer.health += 10;
				this.scene.myPlayer.healthbar.setMeterPercentage(this.scene.myPlayer.health * 100 / this.scene.myPlayer.maxHealth);
				break;
			case 'regenPotion':
				break;
		}
		
	}
}