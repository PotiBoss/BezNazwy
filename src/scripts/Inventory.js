

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

		this.addItem({name: 'healthPotion', quantity: 30})
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
				this.scene.regenBuff = this.scene.add.image(this.scene.backgroundRegen.x, this.scene.backgroundRegen.y, 'pots', 1);

				var removeRegenPotion = this.scene.time.addEvent({ 
					delay: 3000 * 4, 
					callback: this.removeHealthRegenPotion, 
					callbackScope: this
					});
				break;
			case 'cooldownPotion':
				this.scene.myPlayer.cooldownReduction = 0.6;	
				if(cooldownReductionTimer != undefined) {cooldownReductionTimer.remove()}
				this.scene.cooldownBuff = this.scene.add.image(this.scene.backgroundCooldown.x, this.scene.backgroundCooldown.y, 'pots', 4);
				var cooldownReductionTimer = this.scene.time.addEvent({ 
					delay: 5000, 
					callback: this.cooldownReductionPotion, 
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
				this.scene.speedBuff = this.scene.add.image(this.scene.backgroundSpeed.x, this.scene.backgroundSpeed.y, 'pots', 2);
				break;
			case 'damagePotion':
				if(attackDamageTimer != undefined) {attackDamageTimer.remove()}
				this.scene.myPlayer.damageBonus = 1.5;
				var attackDamageTimer = this.scene.time.addEvent({ 
					delay: 5000, 
					callback: this.attackPotion, 
					callbackScope: this
					});
				this.scene.damageBuff = this.scene.add.image(this.scene.backgroundDamage.x, this.scene.backgroundDamage.y, 'pots', 3);
				break;
			case 'skillDamagePotion':
					this.scene.myPlayer.skillDamageBonus += 5;
					this.scene.skillDamageBuff = this.scene.add.image(this.scene.backgroundSkillDamage.x, this.scene.backgroundSkillDamage.y, 'pots', 6);
						break;
			case 'healthPotion':
				this.scene.myPlayer.health += 25;
				if(this.scene.myPlayer.health > this.scene.myPlayer.maxHealth) {this.scene.myPlayer.health = this.scene.myPlayer.maxHealth}
				this.scene.myPlayer.healthbar.setMeterPercentage(this.scene.myPlayer.health * 100 / this.scene.myPlayer.maxHealth);
				break;
			case 'lifeStealPotion':
				this.scene.myPlayer.lifesteal += 8;	
				this.scene.lifeStealBuff = this.scene.add.image(this.scene.backgroundLifeSteal.x, this.scene.backgroundLifeSteal.y, 'pots', 8);		
				break;
			case 'projectileSpeedPotion':
				if(projectileSpeedTimer != undefined) {projectileSpeedTimer.remove()}
				this.scene.myPlayer.projectileSpeedBonus = 1.5;
				var projectileSpeedTimer = this.scene.time.addEvent({ 
					delay: 5000, 
					callback: this.projectileSpeedPotion, 
					callbackScope: this
					});
				break;
			case 'attackCooldownPotion':
				if(attackCooldownTimer != undefined) {attackCooldownTimer.remove()}
				this.scene.myPlayer.attackCooldownReduction = true;
				var attackCooldownTimer = this.scene.time.addEvent({ 
					delay: 5000, 
					callback: this.attackCooldownPotion, 
					callbackScope: this
					});
				break;

			case 'attackSpeedPotion':
				if(attackSpeedTimer != undefined) {attackSpeedTimer.remove()}
				this.scene.myPlayer.attackSpeedReduction = 0.4;
				var attackSpeedTimer = this.scene.time.addEvent({ 
					delay: 5000, 
					callback: this.attackSpeedPotion, 
					callbackScope: this
					});
				break;		
		}
	}

	healthRegenPotion()
	{
		this.scene.myPlayer.health += 5;
		if(this.scene.myPlayer.health > this.scene.myPlayer.maxHealth) {this.scene.myPlayer.health = this.scene.myPlayer.maxHealth}
		this.scene.myPlayer.healthbar.setMeterPercentage(this.scene.myPlayer.health * 100 / this.scene.myPlayer.maxHealth);
	}

	speedPotion()
	{
		this.scene.myPlayer.playerSpeed = 150;
		this.scene.speedBuff.x = 9999;
		this.scene.speedBuff.y = 9999; 
		this.scene.speedBuff = undefined;
	}

	cooldownReductionPotion()
	{
		this.scene.myPlayer.cooldownReduction = 1.0;
		this.scene.cooldownBuff.x = 9999;
		this.scene.cooldownBuff.y = 9999; 
		this.scene.cooldownBuff = undefined;
	}

	attackPotion()
	{
		this.scene.myPlayer.damageBonus = 1.0;
		this.scene.damageBuff.x = 9999;
		this.scene.damageBuff.y = 9999; 
		this.scene.damageBuff = undefined;
	}

	projectileSpeedPotion()
	{
		this.scene.myPlayer.projectileSpeedBonus = 1.0;
	}

	attackCooldownPotion()
	{
		this.scene.myPlayer.attackCooldownReduction = false;
	}

	attackSpeedPotion()
	{
		this.scene.myPlayer.attackSpeedReduction = 1.0;
	}

	removeHealthRegenPotion()
	{
		this.scene.regenBuff.x = 9999;
		this.scene.regenBuff.y = 9999; 
		this.scene.regenBuff = undefined;
	}

	removeSkillDamagePotion()
	{
		this.scene.skillDamageBuff.x = 9999;
		this.scene.skillDamageBuff.y = 9999; 
		this.scene.skillDamageBuff = undefined;
	}

	removeLifeStealPotion()
	{
		this.scene.lifeStealBuff.x = 9999;
		this.scene.lifeStealBuff.y = 9999; 
		this.scene.lifeStealBuff = undefined;
	}
}