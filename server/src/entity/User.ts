import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { EncryptionTransformer } from "typeorm-encrypted"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({unique: true})
    email: string;

    @Column()
    phone: string;

    @Column({
        select: false,
        transformer: new EncryptionTransformer({
            key: '97054c735256b7ac75fc1786d69240be3b7bed12acb2257ec70ae2bf045b4d78',
            algorithm: 'aes-256-cbc',
            ivLength: 16,
            iv: 'ff5ac19190424b1d88f9419ef949ae56'
        })
    })
    password: string;

    @Column({default: false})
    admin: boolean;
}
