import { Pitches } from './pitches.model'
import { Games } from '../lobby/games.model'

export class Plays{
   public games: Games;
   public PlayID: number;
   public InningID: number;
   public InningNumber: number;
   public InningHalf: string;
   public PlayNumber: number;
   public InningBatterNumber: number;
   public AwayTeamRuns: number;
   public HomeTeamRuns: number;
   public HitterID: number;
   public PitcherID: number;
   public HitterTeamID: number;
   public PitcherTeamID: number;
   public HitterName: string;
   public PitcherName: string;
   public PitcherThrowHand: string;
   public HitterBatHand: string;
   public HitterPosition: string;
   public Outs: number;
   public Balls: number;
   public Strikes: number;
   public PitchNumberThisAtBat: number;
   public Result: string;
   public NumberOfOutsOnPlay: number;
   public RunsBattedIn: number;
   public AtBat: boolean;
   public Strikeout: boolean;
   public Walk: boolean;
   public Hit: boolean;
   public Out: boolean;
   public Sacrifice: boolean;
   public Error: boolean;
   public Updated: Date;
   public Description:string;
   public Runner1ID: number;
   public Runner2ID: number;
   public Runner3ID: number;
   public Pitches: Pitches[];
   public isUndo: boolean;
   public created_at: Date;
   public updated_at: Date;

}