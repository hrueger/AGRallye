import { Pipe, PipeTransform } from "@angular/core";
import { Team } from "../_models/Team";

@Pipe({
    name: "sumPoints",
})
export class SumPointsPipe implements PipeTransform {
    transform(team: Team): number {
        return team.tasks.map((t) => t.points).reduce((a, b) => a + b, 0);
    }
}
