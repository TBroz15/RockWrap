import { Entity, system, Vector3, world } from "@minecraft/server";
import { DynamicPropertyManager } from "./DynamicPropertyManager";
import { PlayerManager } from "./PlayerManager";
import { ConsoleManager } from "./ConsoleManager";
import { EffectOptions } from "./interfaces/EffectOptions";

class EntityManager {
    public readonly identifier: string;
    public readonly instance: Entity;
    public readonly location: Vector3;
    public readonly typeId: string;

    public constructor(entity: Entity) {
        if (!(entity instanceof Entity))
            throw ConsoleManager.error(`Entity was not defined correctly!`);

        if (!entity.dimension.getEntities().find((x) => x.id === entity.id))
            throw ConsoleManager.error(`Entity '${this.instance.typeId}' could not be found!`);

        this.instance = entity;
        this.identifier = entity.id;
        this.location = entity.location;
        this.typeId = entity.typeId;
    };

    public get nameTag(): string {
        return this.instance.nameTag;
    };

    public set nameTag(value: string) {
        this.instance.nameTag = value;
    };

    /**
     * If Entity is a Player, returns `PlayerManager`, otherwise `undefined`.
     */

    public get playerInstance(): PlayerManager | undefined {
        const player = world.getPlayers().find((x) => x.id === this.identifier);

        return player ? new PlayerManager(player) : undefined;
    };

    public getData(identifier: string, replaceValue: string | number | boolean | Vector3 = undefined): string | number | boolean | Vector3 {
        return new DynamicPropertyManager(this.instance.id + ":" + identifier).get(replaceValue as any);
    };

    public setData(identifier: string, value: string | number | boolean | Vector3): void {
        new DynamicPropertyManager(this.instance.id + ":" + identifier).set(value);
    };

    public addEffect(type: string, { duration = 20 * 20, amplifier = 0, showParticles = true, infinity = false }: EffectOptions): void {
        if (infinity) {
            system.runInterval(() => {
                this.instance.addEffect(type, 21, { amplifier: amplifier, showParticles: showParticles });
            }, 20);
        } else {
            this.instance.addEffect(type, duration, { amplifier: amplifier, showParticles: showParticles });
        };
    };
};

export { EntityManager };