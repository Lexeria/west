import Card from "./Card.js";
import Game from "./Game.js";
import TaskQueue from "./TaskQueue.js";
import SpeedRate from "./SpeedRate.js";

// Отвечает является ли карта уткой.
function isDuck(card) {
	return card && card.quacks && card.swims;
}

// Отвечает является ли карта собакой.
function isDog(card) {
	return card instanceof Dog;
}

// Дает описание существа по схожести с утками и собаками
function getCreatureDescription(card) {
	if (isDuck(card) && isDog(card)) {
		return "Утка-Собака";
	}
	if (isDuck(card)) {
		return "Утка";
	}
	if (isDog(card)) {
		return "Собака";
	}
	return "Существо";
}

class Creature extends Card {
	constructor(name, power) {
		super(name, power);
	}

	getDescriptions() {
		return [getCreatureDescription(this), ...super.getDescriptions()];
	}
}

// Основа для утки.
class Duck extends Creature {
	constructor(name, power) {
		super(name || "Мирная утка", power || 2);
	}

	quacks() {
		console.log("quack");
	}

	swims() {
		console.log("float: both;");
	}
}

// Основа для собаки.
class Dog extends Creature {
	constructor(name, power) {
		super(name || "Пес-бандит", power || 3);
	}
}

class Trasher extends Dog {
	constructor(name, power) {
		super(name || "Громила", power || 5);
	}

	modifyTakenDamage(value, fromCard, gameContext, continuation) {
		this.view.signalAbility(() => continuation(Math.max(0, value - 1)));
	}

	getDescriptions() {
		return ["Уменьшает полученный урон на 1", ...super.getDescriptions()];
	}
}

// Колода Шерифа, нижнего игрока.
const seriffStartDeck = [new Duck(), new Duck(), new Duck(), new Duck()];

// Колода Бандита, верхнего игрока.
const banditStartDeck = [new Trasher()];

// Создание игры.
const game = new Game(seriffStartDeck, banditStartDeck);

// Глобальный объект, позволяющий управлять скоростью всех анимаций.
SpeedRate.set(1);

// Запуск игры.
game.play(false, (winner) => {
	alert("Победил " + winner.name);
});
