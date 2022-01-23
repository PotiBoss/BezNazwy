

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
		console.log(itemName)
		switch(itemName)
		{
			case 'regenPotion':
				if(regenPotionTimer != undefined) {regenPotionTimer.remove()} // ??
				var regenPotionTimer = this.scene.time.addEvent({ 
					delay: 3000, 
					callback: this.healthRegenPotion, 
					repeat: 4,
					callbackScope: this
					});
				break;
			case 'cooldownPotion':
				this.scene.myPlayer.cooldownReduction = 0.6;	
				if(cooldownReductionTimer != undefined) {cooldownReductionTimer.remove()}
				var cooldownReductionTimer = this.scene.time.addEvent({ 
					delay: 5000, 
					callback: this.cooldownReduction, 
					callbackScope: this
					});
				break;	
			case 'speedPotion':
				if(moveSpeedTimer != undefined) {moveSpeedTimer.remove()}
				this.scene.myPlayer.playerSpeed = 250;
				var moveSpeedTimer = this.scene.time.addEvent({ 
					delay: 5000, 
					callback: this.speedPotion, 
					callbackScope: this
					});
				break;
			case 'damagePotion':
				if(attackDamageTimer != undefined) {attackDamageTimer.remove()}
				this.scene.myPlayer.damageBonus = 1.5;
				var attackDamageTimer = this.scene.time.addEvent({ 
					delay: 5000, 
					callback: this.attackPotion, 
					callbackScope: this
					});
				break;
			case 'healthPotion':
				this.scene.myPlayer.health += 25;
				this.scene.myPlayer.healthbar.setMeterPercentage(this.scene.myPlayer.health * 100 / this.scene.myPlayer.maxHealth);
				break;
			case 'skillDamagePotion':
			this.scene.myPlayer.skillDamageBonus += 5;
				break;
			
		}
	}

	healthRegenPotion()
	{
		this.scene.myPlayer.health += 5;
		this.scene.myPlayer.healthbar.setMeterPercentage(this.scene.myPlayer.health * 100 / this.scene.myPlayer.maxHealth);
	}

	speedPotion()
	{
		this.scene.myPlayer.playerSpeed = 150;
	}

	cooldownReduction()
	{
		this.scene.myPlayer.cooldownReduction = 1.0;
	}

	attackPotion()
	{
		this.scene.myPlayer.damageBonus = 1.0;
	}
}